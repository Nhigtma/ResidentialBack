export interface HouseData {
    'CASA/APTO': string | number;
    'NOMBRE_RESIDENTE': string;
    'CC_RESIDENTE': number;
    'CEL_RESIDENTE': number;
}

export interface HousesRetrieve {
        'id': string;
        "casa/apto": string | number;
        "name_resident": string;
        "cc_resident": number;
        "phone_resident": number;
}

export interface UpdateHouseInterface {
    'id':string
    'cc_resident': number;
    'name_resident': string;
    'phone_resident': number;
}