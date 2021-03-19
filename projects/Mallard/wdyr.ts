// <reference types="@welldone-software/why-did-you-render" />

import React from 'react';

console.log('process.env.NODE_ENV ', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}