

import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";

export interface FetchResponse<T> { 
    count: number, 
    results: T[] 
}

const useData = <T>(endpoint: string, requestConfig?: AxiosRequestConfig) => {
    const [data, setData] = useState<T[]>([]);
    const [error, setError] = useState("");
    const [, setIsLoading] = useState(false);
    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);        
        apiClient.get<FetchResponse<T>>(endpoint, {
            signal: controller.signal, ...requestConfig})
        .then(res => {
            setData(res.data.results)
        })
        .catch(e => {
            if (e instanceof CanceledError) return;
            setError(e.message)
            console.error(e.message)
        })
        .finally(() => setIsLoading(false))

        return () => controller.abort();
    }, [endpoint]);
    return {
        data, 
        error,       
    }
};

export default useData;