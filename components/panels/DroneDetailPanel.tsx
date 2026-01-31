'use client';

import { useState } from 'react';
import { useDroneStore } from '@/lib/stores/drone-store';
import { X, MapPin, Compass, User, Radio, Clock, Building2, Phone, Mail, ShieldCheck, FileText, Target, Loader2 } from 'lucide-react';
import { DroneModelViewer } from './DroneModel';
import { FlightPurpose } from '@/types/drone';
import { getFAARemoteIDService } from '@/lib/services/faa-remote-id-service';
import { FAARemoteIDLookupResponse } from '@/types/faa';

const purposeLabels: Record<FlightPurpose, string> = {
  recreational: 'Recreational',
  commercial: 'Commercial',
  emergency: 'Emergency',
  public_safety: 'Public Safety',
  research: 'Research',
  education: 'Education',
  agriculture: 'Agriculture',
  infrastructure_inspection: 'Infrastructure',
};

const purposeColors: Record<FlightPurpose, string> = {
  recreational: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  commercial: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  emergency: 'bg-red-500/20 text-red-400 border-red-500/30',
  public_safety: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  research: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  education: 'bg-green-500/20 text-green-400 border-green-500/30',
  agriculture: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  infrastructure_inspection: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function DroneDetailPanel() {
  const selectedDroneId = useDroneStore((s) => s.selectedDroneId);
  const drones = useDroneStore((s) => s.drones);
  const selectDrone = useDroneStore((s) => s.selectDrone);

  const [faaLoading, setFaaLoading] = useState(false);
  const [faaResult, setFaaResult] = useState<FAARemoteIDLookupResponse | null>(null);

  const drone = drones.find((d) => d.id === selectedDroneId);
  if (!drone) return null;

  const { identification, location, operator, status, selfIdDescription, lastSeen, signalStrength } = drone;

  const handleFAALookup = async () => {
    setFaaLoading(true);
    const service = getFAARemoteIDService();
    const result = await service.lookupOperator({
      operatorId: operator.operatorId,
      droneRegistration: operator.droneRegistration,
    });
    setFaaResult(result);
    setFaaLoading(false);
  };

  const statusColor: Record<string, string> = {
    airborne: 'bg-green-500',
    ground: 'bg-gray-500',
    emergency: 'bg-red-500',
    remote_id_system_failure: 'bg-yellow-500',
    undeclared: 'bg-gray-400',
  };

  const secondsAgo = Math.round((Date.now() - lastSeen) / 1000);

  return (
    <div className="w-80 bg-slate-900/95 border border-cyan-500/30 rounded-lg backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-mono font-bold text-lg">{identification.uasId}</span>
          <button
            onClick={() => selectDrone(null)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <span className={`${statusColor[status] ?? 'bg-gray-500'} text-white text-xs px-2 py-0.5 rounded-full font-semibold`}>
            {status.toUpperCase().replace(/_/g, ' ')}
          </span>
          <span className="border border-cyan-500/40 text-cyan-400 text-xs px-2 py-0.5 rounded-full">
            {identification.uaType.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* 3D Model Viewer */}
      <div className="px-4 pt-3">
        <DroneModelViewer
          uaType={identification.uaType}
          uasId={identification.uasId}
        />
      </div>

      <div className="p-4 space-y-4 text-sm">
        {/* Location */}
        <section>
          <h4 className="text-cyan-400 font-semibold flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5" /> Location
          </h4>
          <div className="grid grid-cols-2 gap-1.5 text-gray-300 font-mono text-xs">
            <div><span className="text-gray-500">Lat:</span> {location.latitude.toFixed(6)}</div>
            <div><span className="text-gray-500">Lng:</span> {location.longitude.toFixed(6)}</div>
            <div><span className="text-gray-500">Alt:</span> {location.altitudeBaro.toFixed(1)}m</div>
            <div><span className="text-gray-500">Hgt:</span> {location.height.toFixed(1)}m</div>
          </div>
        </section>

        {/* Movement */}
        <section>
          <h4 className="text-cyan-400 font-semibold flex items-center gap-1.5 mb-2">
            <Compass className="h-3.5 w-3.5" /> Movement
          </h4>
          <div className="grid grid-cols-2 gap-1.5 text-gray-300 font-mono text-xs">
            <div><span className="text-gray-500">Speed:</span> {location.speedHorizontal.toFixed(1)} m/s</div>
            <div><span className="text-gray-500">Hdg:</span> {location.direction.toFixed(0)}°</div>
            <div><span className="text-gray-500">V-Spd:</span> {location.speedVertical.toFixed(1)} m/s</div>
          </div>
        </section>

        {/* Operator */}
        <section className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-cyan-400 font-semibold flex items-center gap-1.5">
              <User className="h-4 w-4" /> Operator
            </h4>
            {operator.faaVerified && (
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>FAA Verified</span>
              </div>
            )}
          </div>

          <div className="mb-2.5">
            <div className="text-white font-medium text-sm">{operator.pilotName}</div>
            <div className="text-xs text-gray-500 font-mono">{operator.operatorId}</div>
          </div>

          {operator.organization && (
            <div className="flex items-start gap-2 mb-2 text-xs">
              <Building2 className="h-3.5 w-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{operator.organization}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 mb-3">
            <Target className="h-3.5 w-3.5 text-gray-500" />
            <span className={`text-xs px-2 py-0.5 rounded border ${purposeColors[operator.flightPurpose]}`}>
              {purposeLabels[operator.flightPurpose]}
            </span>
          </div>

          <div className="border-t border-slate-700 pt-2.5 space-y-1.5">
            {operator.licenseNumber && (
              <div className="flex items-center gap-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-gray-500">Part 107:</span>
                <span className="text-gray-300 font-mono">{operator.licenseNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <FileText className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-gray-500">Reg:</span>
              <span className="text-gray-300 font-mono">{operator.droneRegistration}</span>
            </div>
            {operator.contactEmail && (
              <div className="flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-gray-300">{operator.contactEmail}</span>
              </div>
            )}
            {operator.contactPhone && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-gray-300">{operator.contactPhone}</span>
              </div>
            )}
          </div>

          {operator.operatorLatitude != null && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-700">
              <div className="flex items-center gap-2 text-xs mb-1">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-gray-500">Operator Location</span>
              </div>
              <div className="text-gray-300 font-mono text-xs ml-5">
                {operator.operatorLatitude.toFixed(4)}, {operator.operatorLongitude?.toFixed(4)}
              </div>
              <div className="text-gray-500 text-xs ml-5">
                Operating area: {operator.areaRadius}m radius
              </div>
            </div>
          )}

          {/* FAA Lookup */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-700">
            <button
              onClick={handleFAALookup}
              disabled={faaLoading}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
              {faaLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
              {faaLoading ? 'Verifying...' : 'Verify with FAA'}
            </button>
            {faaResult && (
              <div className="mt-2 text-xs">
                {faaResult.verified && faaResult.data ? (
                  <div className="space-y-1 text-gray-300">
                    <div className="text-green-400 font-medium">Registration confirmed</div>
                    <div><span className="text-gray-500">Certificate:</span> {faaResult.data.certificateType.replace(/_/g, ' ')}</div>
                    {faaResult.data.certificateExpiry && (
                      <div><span className="text-gray-500">Cert expires:</span> {faaResult.data.certificateExpiry}</div>
                    )}
                    <div><span className="text-gray-500">Reg expires:</span> {faaResult.data.registrationExpiry}</div>
                    <div><span className="text-gray-500">Location:</span> {faaResult.data.operatorAddress.city}, {faaResult.data.operatorAddress.state}</div>
                  </div>
                ) : (
                  <div className="text-yellow-400">{faaResult.error || 'Not found in FAA database'}</div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Description */}
        {selfIdDescription && (
          <section>
            <div className="text-gray-400 text-xs italic">&ldquo;{selfIdDescription}&rdquo;</div>
          </section>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-slate-700">
          <div className="flex items-center gap-1">
            <Radio className="h-3 w-3" />
            {signalStrength ? `${signalStrength.toFixed(0)} dBm` : 'N/A'}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {secondsAgo}s ago
          </div>
        </div>
      </div>
    </div>
  );
}
