export class ApplicableSeatAttributes
{
    applicableSeatGroups : PreferenceGroups[];
}

export class PreferenceGroups
{
    groupType : string;
    applicablePreferenceCodes : PreferenceCodes[];
}

export class PreferenceCodes
{
    prefCode : string;
    prefValue : string;
    IsUserPref : boolean;
}