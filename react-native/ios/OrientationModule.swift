import Foundation
import UIKit
import React

@objc(OrientationModule)
class OrientationModule: RCTEventEmitter {
    
    private var hasListeners = false
    private var lastValidOrientation: UIDeviceOrientation = .landscapeLeft
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(deviceOrientationDidChange),
            name: UIDevice.orientationDidChangeNotification,
            object: nil
        )
    }
    
    override func startObserving() {
        hasListeners = true
        UIDevice.current.beginGeneratingDeviceOrientationNotifications()
    }
    
    override func stopObserving() {
        hasListeners = false
        UIDevice.current.endGeneratingDeviceOrientationNotifications()
    }
    
    override func supportedEvents() -> [String]! {
        return ["orientationDidChange"]
    }
    
    private func isValidOrientation(_ orientation: UIDeviceOrientation) -> Bool {
        switch orientation {
        case .portrait, .portraitUpsideDown, .landscapeLeft, .landscapeRight:
            return true
        default:
            return false
        }
    }
    
    private func getCurrentScreenSize() -> CGSize {
        return UIScreen.main.bounds.size
      
    }
    
    private func getOrientationData(_ orientation: UIDeviceOrientation) -> [String: Any] {
        let isLandscape = orientation.isLandscape
        let orientationString = isLandscape ? "LANDSCAPE" : "PORTRAIT"
        let screenSize = getCurrentScreenSize()
        
        return [
            "orientation": orientationString,
            "isLandscape": isLandscape,
            "width": screenSize.width,
            "height": screenSize.height
        ]
    }
    
    @objc
    func deviceOrientationDidChange() {
        if hasListeners {
            let currentOrientation = UIDevice.current.orientation
          
            // Only process valid orientations
            guard isValidOrientation(currentOrientation) else {
                return
            }
        
              DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    // Ensure we still have listeners in case stopObserving was called quickly
                    if self.hasListeners {
                        self.sendEvent(withName: "orientationDidChange", body: self.getOrientationData(currentOrientation))
                    }
                }
        }
    }
    
    @objc
    func getOrientation(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        // Ensure getOrientation also runs on the main thread for consistency
        DispatchQueue.main.async {
            var orientation = UIDevice.current.orientation
            
            // If current orientation is not valid, use the last known valid orientation
            if !self.isValidOrientation(orientation) {
                orientation = self.lastValidOrientation
            }
            
            resolve(self.getOrientationData(orientation))
        }
    }
    
    @objc
    static override func requiresMainQueueSetup() -> Bool {
        return true
    }
} 
