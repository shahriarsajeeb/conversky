import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function useAuthorized() {
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuthorized = async () => {
            const isAuthorized = await AsyncStorage.getItem('authorized')
            setAuthorized(isAuthorized === 'true')
        }
        checkAuthorized()
    }, [])

    return { authorized }
}