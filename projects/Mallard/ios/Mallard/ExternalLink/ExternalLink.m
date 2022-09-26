//
//  ExternalLink.m
//  Mallard
//
//  Created by James Miller on 22/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(RNExternalLink, ExternalLink, NSObject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXTERN_METHOD(open)

RCT_EXTERN_METHOD(canOpen)

@end
