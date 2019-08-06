const membershipResponse = {
    userId: 'uid',
    showSupportMessaging: true,
    contentAccess: {
        member: false,
        paidMember: false,
        recurringContributor: false,
        digitalPack: false,
        paperSubscriber: false,
        guardianWeeklySubscriber: false,
    },
}

const userResponse = {
    id: '123',
    dates: {
        accountCreatedDate: '2019',
    },
    adData: {},
    consents: [],
    userGroups: [],
    socialLinks: [],
    publicFields: {
        displayName: 'User Name',
    },
    statusFields: {
        hasRepermissioned: false,
        userEmailValidated: true,
        allowThirdPartyProfiling: false,
    },
    primaryEmailAddress: 'username@example.com',
    hasPassword: true,
}

const userData = {
    userDetails: userResponse,
    membershipData: membershipResponse,
}

const casExpiry = {
    content: '',
    expiryDate: '',
    expiryType: '',
    provider: '',
    subscriptionCode: '123',
}

export { membershipResponse, userResponse, userData, casExpiry }
