"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { FaLocationPin } from "react-icons/fa6"
import { renderToString } from "react-dom/server"

interface MapComponentProps {
    latitude: number
    longitude: number
    zoom?: number
    onMapClick: (lat: number, lng: number) => void
}

export default function MapComponent({ latitude, longitude, zoom = 13, onMapClick }: MapComponentProps) {
    const mapRef = useRef<L.Map | null>(null)
    const markerRef = useRef<L.Marker | null>(null)
    const [mapReady, setMapReady] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([latitude, longitude], zoom)
            L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
                maxZoom: 19,
                attribution:
                    "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
            }).addTo(mapRef.current)

            setMapReady(true)
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [latitude, longitude, zoom])

    useEffect(() => {
        if (!mapReady || !mapRef.current) return

        const iconHtml = renderToString(<FaLocationPin size={32} color="#FF0000" />)
        const customIcon = L.divIcon({
            html: iconHtml,
            className: "custom-pin-icon",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        })

        if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude])
        } else {
            markerRef.current = L.marker([latitude, longitude], {
                icon: customIcon,
            }).addTo(mapRef.current)
        }

        mapRef.current.setView([latitude, longitude], zoom)

        const clickHandler = (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng
            onMapClick(lat, lng)
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng])
            }
        }

        mapRef.current.on("click", clickHandler)

        return () => {
            if (mapRef.current) {
                mapRef.current.off("click", clickHandler)
            }
        }
    }, [latitude, longitude, zoom, onMapClick, mapReady])

    return <div id="map" className="h-[400px] w-full rounded-md border" aria-label="Map showing specified location" />
}

