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

  @objc func canOpen() {
    if #available(iOS 16.0, *) {
      Task {
        let result = try await ExternalLinkAccount.canOpen
        return result
      }
    }
   }
  
  @objc func open() {
    if #available(iOS 16.0, *) {
      Task {
        try? await ExternalLinkAccount.open()
      }
    }
   }

}
