//
//  ReleaseStream.swift
//  Mallard
//
//  Created by Richard Beddington on 28/08/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(ReleaseStream)
class ReleaseStream: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    // https://github.com/react-native-community/react-native-device-info/issues/228
    // and also https://github.com/guardian/ios-live/blob/1086c71bddd13a97ee61fa83059d450f87791bdd/GLA/GLA/Classes/GLASettings%2BReleaseChannel.swift#L47
    return ["getReleaseStream": Bundle.main.appStoreReceiptURL?.lastPathComponent == "sandboxReceipt" ? "TESTFLIGHT" : "UNKNOWN"]
  }
}
