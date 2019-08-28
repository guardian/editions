//
//  Ophan.m
//
//  Created by Max Spencer on 25/06/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

 #import <Foundation/Foundation.h>
#import <ophan/ophan.h>
#import "Ophan.h"

 @implementation Ophan

 RCT_EXPORT_MODULE();

 RCT_EXPORT_METHOD(getGreeting: (RCTResponseSenderBlock)callback){
  callback(@[[OphanOphanKt hello]]);
}

 @end
