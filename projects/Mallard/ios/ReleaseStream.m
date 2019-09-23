//
//  ReleaseStream.m
//  Mallard
//
//  Created by Richard Beddington on 28/08/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_REMAP_MODULE(RNReleaseStream, ReleaseStream, NSObject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}


@end

