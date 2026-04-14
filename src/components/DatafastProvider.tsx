'use client';

import { useEffect } from 'react';
import { initDataFast } from 'datafast';

export default function DatafastProvider() {
  useEffect(() => {
    initDataFast({
      websiteId: 'dfid_OZLh2a7uYDfwlvZ3y04sn',
      cookieless: true,
      autoCapturePageviews: true,
    });
  }, []);

  return null;
}
