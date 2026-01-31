export interface FAARemoteIDLookupRequest {
  operatorId: string;
  droneRegistration?: string;
  uasId?: string;
}

export interface FAARemoteIDLookupResponse {
  success: boolean;
  verified: boolean;
  data?: {
    pilotName: string;
    organization: string | null;
    licenseNumber: string | null;
    droneRegistration: string;
    certificateType: 'part_107' | 'recreational' | 'public_coa' | 'none';
    certificateExpiry: string | null;
    registrationExpiry: string;
    operatorAddress: {
      city: string;
      state: string;
      zipCode: string;
    };
  };
  error?: string;
  timestamp: number;
}
