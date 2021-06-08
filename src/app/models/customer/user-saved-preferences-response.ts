export class UserSavedPreferences
{
    preference : Preference[];
}
export class Preference
{
    preferencegroups : PreferenceGroups[];
    preftype : string;
}
export class PreferenceGroups
{
    groupid : number;
    grouptype : string;
    preferencecodes : PreferenceCodes[];
}
export class PreferenceCodes
{
    prefcode : string;
    prefdescription : string;
    prefvalue: string;
}