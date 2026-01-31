import { NextRequest, NextResponse } from 'next/server';
import { FAARemoteIDLookupRequest, FAARemoteIDLookupResponse } from '@/types/faa';

const MOCK_FAA_DATABASE: Record<string, NonNullable<FAARemoteIDLookupResponse['data']>> = {
  FA38KL9Q2R: {
    pilotName: 'Sarah Martinez',
    organization: 'Austin Aerial Surveys LLC',
    licenseNumber: '4217895',
    droneRegistration: 'FA38KL9Q2R',
    certificateType: 'part_107',
    certificateExpiry: '2026-08-15',
    registrationExpiry: '2027-01-20',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78701' },
  },
  FA72NM5P1K: {
    pilotName: 'Dr. James Chen',
    organization: 'University of Texas - Civil Engineering',
    licenseNumber: '4891023',
    droneRegistration: 'FA72NM5P1K',
    certificateType: 'part_107',
    certificateExpiry: '2027-03-10',
    registrationExpiry: '2027-06-01',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78712' },
  },
  FA91XJ3T7W: {
    pilotName: 'Michael Thompson',
    organization: null,
    licenseNumber: null,
    droneRegistration: 'FA91XJ3T7W',
    certificateType: 'recreational',
    certificateExpiry: null,
    registrationExpiry: '2027-04-15',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78704' },
  },
  FA65RT8K4M: {
    pilotName: 'Jennifer Lee',
    organization: 'QuickDeliver Drone Services',
    licenseNumber: '5023456',
    droneRegistration: 'FA65RT8K4M',
    certificateType: 'part_107',
    certificateExpiry: '2026-11-30',
    registrationExpiry: '2027-02-28',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78703' },
  },
  FA44WP2Y9V: {
    pilotName: 'Officer Robert Garcia',
    organization: 'Austin Police Department - Air Support',
    licenseNumber: '4756129',
    droneRegistration: 'FA44WP2Y9V',
    certificateType: 'public_coa',
    certificateExpiry: '2027-01-01',
    registrationExpiry: '2027-05-10',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78701' },
  },
  FA29BV6H3Q: {
    pilotName: 'David Kim',
    organization: 'Texas State Capitol Security',
    licenseNumber: '4982341',
    droneRegistration: 'FA29BV6H3Q',
    certificateType: 'public_coa',
    certificateExpiry: '2026-12-31',
    registrationExpiry: '2027-03-15',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78701' },
  },
  FA17KL4N8P: {
    pilotName: 'Carlos Rodriguez',
    organization: 'SkyMap Technologies',
    licenseNumber: '4634789',
    droneRegistration: 'FA17KL4N8P',
    certificateType: 'part_107',
    certificateExpiry: '2027-05-20',
    registrationExpiry: '2027-08-01',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78745' },
  },
  FA82PQ7M5L: {
    pilotName: 'Emily Watson',
    organization: 'Urban Mapping Solutions',
    licenseNumber: '5134567',
    droneRegistration: 'FA82PQ7M5L',
    certificateType: 'part_107',
    certificateExpiry: '2027-02-28',
    registrationExpiry: '2027-07-15',
    operatorAddress: { city: 'Austin', state: 'TX', zipCode: '78702' },
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: FAARemoteIDLookupRequest = await request.json();

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    const { droneRegistration } = body;

    if (droneRegistration && MOCK_FAA_DATABASE[droneRegistration]) {
      return NextResponse.json({
        success: true,
        verified: true,
        data: MOCK_FAA_DATABASE[droneRegistration],
        timestamp: Date.now(),
      } satisfies FAARemoteIDLookupResponse);
    }

    return NextResponse.json({
      success: true,
      verified: false,
      error: 'Registration not found in FAA database',
      timestamp: Date.now(),
    } satisfies FAARemoteIDLookupResponse, { status: 404 });
  } catch {
    return NextResponse.json({
      success: false,
      verified: false,
      error: 'Internal server error',
      timestamp: Date.now(),
    } satisfies FAARemoteIDLookupResponse, { status: 500 });
  }
}
