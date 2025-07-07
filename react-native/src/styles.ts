import { Assets, Typography, Colors, Spacings } from 'react-native-ui-lib';

Colors.loadColors({
    textPrimary: '#116DFF',
    textDefault: '#20303C',
    textDefaultLight: '#FFFFFF',
    textBlue70: '#557796',
    textDanger: '#D52712',

    backgroundDefault: '#FFFFFF',
    backgroundLight: '#F5F5F6',
    backgroundGrey: '#EEEEEF',
    backgroundInverted: '#20303C',

    searchBackground: '#F4F4F9',

    separator: '#E8ECF0',
});

Typography.loadTypographies({
    headingS: { fontSize: 16, fontWeight: '700', lineHeight: 20, fontFamily: 'WixMadeforDisplayApp-Regular', color: Colors.textDefault },
    headingM: { fontSize: 18, fontWeight: '700', lineHeight: 28, fontFamily: 'WixMadeforDisplayApp-Regular', color: Colors.textDefault },
    headingL: { fontSize: 24, fontWeight: '700', lineHeight: 32, fontFamily: 'WixMadeforDisplayApp-Regular', color: Colors.textDefault },
    headingSmallBold: { fontSize: 16, fontWeight: '500', lineHeight: 24, fontFamily: 'WixMadeforDisplayApp-Regular', color: Colors.textDefault },
    titleBold: { fontSize: 16, fontWeight: '700', lineHeight: 29, fontFamily: 'WixMadeforDisplayApp-Regular', color: Colors.textDefault },
    sectionXSmall: { fontSize: 12, fontWeight: '600', lineHeight: 16, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textBlue70 },
    sectionSmall: { fontSize: 14, fontWeight: '400', lineHeight: 20, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textBlue70 },
    textSmall: { fontSize: 14, fontWeight: '700', lineHeight: 24, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textDefault },
    textSmallLight: { fontSize: 14, fontWeight: '400', lineHeight: 24, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textDefault },
    textDefault: { fontSize: 16, fontWeight: '500', lineHeight: 24, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textDefault },
    textSmallPrimary: { fontSize: 14, fontWeight: '600', lineHeight: 20, fontFamily: 'WixMadeforDisplayApp-Regular', color: Colors.textPrimary },
    textPrimary: { fontSize: 16, fontWeight: '600', lineHeight: 24, fontFamily: 'WixMadeforDisplayApp-Regular', color: Colors.textPrimary },
    textDefaultLight: { fontSize: 18, fontWeight: '600', lineHeight: 24, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textDefaultLight },
    bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textDefault },
    bodySmallBold: { fontSize: 14, fontWeight: '700', lineHeight: 20, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textDefault },
    bodyBold: { fontSize: 16, fontWeight: '700', lineHeight: 24, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textDefault },
    bottomTab: { fontSize: 13, fontWeight: '500', lineHeight: 13, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.textPrimary },
    label: { fontSize: 13, fontWeight: '600', lineHeight: 18, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.black },
    labelMedium: { fontSize: 17, fontWeight: '600', lineHeight: 22, fontFamily: 'WixMadeforTextApp-Regular', color: Colors.black },
});

Spacings.loadSpacings({
    page: 20,
    s1: 4,
    s2: 8,
    s3: 12,
    s4: 16,
    s5: 20,
    s6: 24,
    s7: 28,
    s8: 32,
    s9: 36,
    s10: 40
});

Assets.loadAssetsGroup('icons', {
    cart: require('./assets/images/cart.png'),
    groups: require('./assets/images/groups.png'),
    receipt: require('./assets/images/receipt.png'),
    menu: require('./assets/images/menu.png'),
    creditCard: require('./assets/images/creditcard.png'),
    cash: require('./assets/images/cash.png'),
    discount: require('./assets/images/discount.png'),
});