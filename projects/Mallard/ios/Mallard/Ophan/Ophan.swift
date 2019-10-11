//
//  Ophan.swift
//  RnAppWithKotlin
//
//  Created by Max Spencer on 26/06/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

/**
* IMPORTANT
* Currently ophan doesn't support ARM architectures
* In lieu of this we've made this module a NOOP
* This can be commented out after Max has published the
* additional binaries to bin tray
*/

import Foundation
import ophan

@objc(Ophan)
class Ophan: NSObject {
  
  var ophanApi: OphanApi?
  var lastViewId: String? = nil

  override init() {
    print("Initialising new Ophan instance on thread \(Thread.current)")
    super.init()
    ophanApi = newOphanApi(userId: nil)
  }

  deinit {
    print("Deinitialising Ophan instance on thread \(Thread.current)")
  }
  
  private func newOphanApi(userId: String?) -> OphanApi {
    let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? ""
    let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? ""
    
    // This snippet gets the current device's model name
    var systemInfo = utsname()
    uname(&systemInfo)
    let modelCode = withUnsafePointer(to: &systemInfo.machine) {
        $0.withMemoryRebound(to: CChar.self, capacity: 1) { String(validatingUTF8: $0) }
    }
    let deviceName = modelCode ?? "Unrecognised model"
    let deviceClass = UIDevice.current.userInterfaceIdiom == .pad ? Multiplatform_ophanDeviceClass.tablet : Multiplatform_ophanDeviceClass.phone
    
    return OphanIosKt.getThreadSafeOphanApi (
      appFamily: "iOS Editions",
      appVersion: appVersion + " (" + buildNumber + ")",
      appOsVersion: UIDevice.current.systemVersion,
      deviceName: deviceName,
      deviceManufacturer: "Apple",
      deviceClass: deviceClass,
      deviceId: UIDevice.current.identifierForVendor?.uuidString ?? "",
      userId: userId,
      logger: SimpleLogger(),
      recordStorePath: "ophan"
    )
  }
  
  @objc(setUserId:resolver:rejecter:)
  func setUserId(_ userId: String, resolver resolve: RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    ophanApi = newOphanApi(userId: userId)
    resolve(userId)
  }

  @objc(sendAppScreenEvent:value:resolver:rejecter:)
  func sendAppScreenEvent(_ screenName: String, value: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    do {
      DispatchQueue.main.async {
        self.ophanApi?.sendAppScreenEvent(viewId: self.lastViewId, screenName: screenName, value: value)
        resolve(screenName)
      }
    } catch let error {
      reject("Whoops - ios Ophan is sad", "really sad", nil)
    }
  }

  @objc(sendComponentEvent:action:value:componentId:resolver:rejecter:)
  func sendComponentEvent(_ componentType: String, action: String, value: String?, componentId: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    do {
      DispatchQueue.main.async {
        self.ophanApi?.sendComponentEvent(viewId: self.lastViewId, componentType: componentType, action: action, value: value, componentId: componentId)
        resolve(componentType)
      }
    } catch let error {
      reject("Whoops - ios Ophan is sad", "really sad", nil)
    }
  }

  @objc(sendPageViewEvent:resolver:rejecter:)
  func sendPageViewEvent(_ path: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    do {
      DispatchQueue.main.async {
        self.lastViewId = self.ophanApi?.sendPageViewEvent(path: path)
        resolve(path)
      }
    } catch let error {
      reject("Whoops - ios Ophan is sad", "really sad", nil)
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
