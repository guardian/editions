//
//  Greeting.swift
//  RnAppWithKotlin
//
//  Created by Max Spencer on 26/06/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import ophan

@objc(Ophan)
class Ophan: NSObject {
  
  let ophanApi = OphanKt_.getThreadSafeOphanApi (
    appVersion: "0.0.1",
    appOs: "iOS",
    deviceName: "Unknown",
    deviceManufacturer: "Apple",
    deviceId: "testDeviceId",
    userId: "testUserId",
    logger: SimpleLogger(),
    recordStorePath: "ophan"
  )
  
  override init() {
    super.init()
    print("Initialising new Ophan instance on thread \(Thread.current)")
  }
  
  deinit {
    print("Deinitialising Ophan instance on thread \(Thread.current)")
  }
  
  @objc(getGreeting:)
  func getGreeting(_ callback: RCTResponseSenderBlock) -> Void {
    callback([OphanKt.hello()])
  }
  
  @objc(sendTestAppScreenEvent:resolver:rejecter:)
  
  func sendTestAppScreenEvent(_ screenName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
  
    print("Current thread \(Thread.current)")
  
    do {
      DispatchQueue.main.async {
        print("Current thread \(Thread.current)")
        self.ophanApi.sendTestAppScreenEvent(screenName: screenName, eventId: UUID().uuidString)
        resolve(screenName)
      }
    } catch let error {
      reject("whoops - ios Ophan is sad", "blah", nil)
    }
    
  }
}

class SimpleLogger: Multiplatform_ophanLogger {
  func debug(tag: String, message: String) {
    print("D: " + tag + ": " + message + "\n")
  }
  
  func warn(tag: String, message: String, error: KotlinThrowable?) {
    print("W: " + tag + ": " + message + "\n")
  }
  
}
