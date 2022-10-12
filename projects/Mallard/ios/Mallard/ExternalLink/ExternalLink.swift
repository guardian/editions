//
//  ExternalLink.swift
//  Mallard
//
//  Created by James Miller on 22/09/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import StoreKit

@available(iOS 13.0.0, *)
@objc(ExternalLink)
class ExternalLink: NSObject {
  
  @objc
  func open() {
    guard #available(iOS 16.0, *) else { return }
    Task {
      let canOpen = await ExternalLinkAccount.canOpen
      let canMakePayments = SKPaymentQueue.canMakePayments()
      
      if canOpen, canMakePayments {
        try await ExternalLinkAccount.open()
      }
    }
  }
}
