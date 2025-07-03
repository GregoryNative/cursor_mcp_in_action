#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(OrientationModule, RCTEventEmitter)

RCT_EXTERN_METHOD(getOrientation: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startObserving)
RCT_EXTERN_METHOD(stopObserving)

@end 