import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { type User } from "../types/User";
import type { MapContentProps } from "../types/MapContentProps";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapContent: React.FC<MapContentProps> = ({
  users,
  mySocketId,
  route,
  selectedUser,
  selectedUserId,
}) => {
  function FitBounds({
    me,
    selectedUser,
  }: {
    me?: User;
    selectedUser?: User | null;
  }) {
    const map = useMap();
    useEffect(() => {
      if (me?.lat && me?.lng && selectedUser?.lat && selectedUser?.lng) {
        const bounds = L.latLngBounds([
          [me.lat, me.lng],
          [selectedUser.lat, selectedUser.lng],
        ]);
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 16 });
      } else if (me?.lat && me?.lng) {
        map.setView([me.lat, me.lng], 16);
      }
    }, [me, selectedUser, map]);
    return null;
  }

  const me = users.find((u) => u.userId === mySocketId);

  let polylineCoords: [number, number][] = [];
  if (route?.features?.[0]?.geometry?.coordinates) {
    polylineCoords = route.features[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
    );
  }

  const getIcon = (isSelected: boolean, isMe: boolean) =>
    new L.Icon({
      iconUrl: isMe
        ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
        : isSelected
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
          : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      iconSize: isSelected ? [35, 45] : [25, 41],
      iconAnchor: isSelected ? [17, 45] : [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: markerShadow,
      shadowSize: [41, 41],
    });

  return (
    <MapContainer
      center={[30.0444, 31.2357]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
      className="z-0"
    >
      <FitBounds me={me} selectedUser={selectedUser} />
      <TileLayer
        attribution="slrTech"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {me?.lat && me?.lng && (
        <Marker position={[me.lat, me.lng]} icon={getIcon(false, true)}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {users
        .filter((u) => u.userId !== mySocketId)
        .map((user) => {
          if (!user.lat || !user.lng) return null;
          const dist = parseFloat(String(user.distance));
          const time = parseFloat(String(user.eta));

          return (
            <Marker
              key={user.userId}
              position={[user.lat, user.lng]}
              icon={getIcon(selectedUserId === user.userId, false)}
            >
              <Popup>
                <div className="text-sm">
                  <span
                    className={
                      selectedUserId === user.userId
                        ? "font-bold text-green-600"
                        : "font-semibold"
                    }
                  >
                    User: {user.userId.slice(0, 6)}
                  </span>
                  <div className="mt-1 border-t pt-1 text-xs text-gray-600">
                    <p>
                      Distance:{" "}
                      <span className="text-black font-bold">
                        {!isNaN(dist)
                          ? `${dist.toFixed(2)} km`
                          : "Calculating..."}
                      </span>
                    </p>
                    <p>
                      ETA:{" "}
                      <span className="text-black font-bold">
                        {!isNaN(time) ? `${Math.round(time)} min` : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

      {polylineCoords.length > 0 && (
        <Polyline
          positions={polylineCoords}
          color="#F9A825"
          weight={6}
          opacity={0.8}
        />
      )}
    </MapContainer>
  );
};

export default MapContent;
