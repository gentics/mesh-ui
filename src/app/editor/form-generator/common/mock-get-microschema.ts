import { Observable } from 'rxjs';
import { Microschema } from '../../../common/models/microschema.model';

const geolocationMicroschema = {
        uuid: 'awduhawduahwduinawdiunawdu',
        version: 1,
        description: 'Microschema for Geolocations',
        name: 'geolocation',
        fields: [
            {
                name: 'longitude',
                label: 'Longitude',
                required: true,
                type: 'number' as 'number'
            },
            {
                name: 'latitude',
                label: 'Latitude',
                required: true,
                type: 'number' as 'number'
            },
            {
                name: 'addresses',
                label: 'Addresses',
                type: 'list',
                listType: 'string'
            }
        ]
    } as Microschema;

/**
 * TODO: this will be a real call to the API of course...
 */
export function mockGetMicroschemaByUuid(uuid: string): Observable<Microschema> {
    return Observable.of(geolocationMicroschema);
}

export function mockGetMicroschemaByName(name: string): Observable<Microschema> {
    return Observable.of(geolocationMicroschema);
}
