"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function MapView() {
    const mapRef = useRef<L.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return

        // Fix Leaflet's default icon path issues
        L.Icon.Default.imagePath = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/"

        // Initialize map
        mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2)

        // Add ArcGIS Online tile layer with HTTPS
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
            attribution:
                "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
            maxZoom: 18,
        }).addTo(mapRef.current)

        // Cleanup function
        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [])

    return (
        <div className="w-full h-[600px] relative border rounded-lg overflow-hidden">
            <div
                ref={mapContainerRef}
                className="absolute inset-0 z-0 [&_.leaflet-tile-pane]:z-0 [&_.leaflet-control-container]:z-10"
                style={{ background: "#f8f9fa" }}
            />
        </div>
    )
}

