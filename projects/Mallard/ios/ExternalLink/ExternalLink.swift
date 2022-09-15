import Foundation
import StoreKit

@objc(ExternalLink)
class ExternalLink: NSObject {

  @objc(canOpen:resolver:rejecter:)
  func canOpen(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Bool {
    do {
        let canOpen = ExternalLinkAccount.canOpen();
        resolve(canOpen);
    } catch let error {
      reject("Whoops - ios is sad", "really sad", nil)
    }
  }

  @objc(open:resolver:rejecter:)
  func open(resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    do {
        resolve(ExternalLinkAccount.open());
    } catch let error {
      reject("Whoops - ios is sad", "really sad", nil)
    }
  }
}
