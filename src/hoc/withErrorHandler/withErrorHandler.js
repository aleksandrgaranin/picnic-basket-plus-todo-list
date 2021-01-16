import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxx/Auxx';


const withErrorHandler = (WrappedComponent, axios) => {    
        return props => {
            const [error, setError] = useState(null);
            
                const reqInterseptor = axios.interceptors.request.use(req =>{
                    setError(null);
                    return req;
                });

                const resInterseptor = axios.interceptors.response.use(res => res, err => {
                    setError(err);                    
                });

            useEffect(() => {
                axios.interceptors.request.eject(reqInterseptor);
                axios.interceptors.response.eject(resInterseptor);
            }, [reqInterseptor, resInterseptor]);

            const errorConfirmedHandler = () => {
                setError(null)
            }


            
                return (
                    <Aux>
                        <Modal 
                            show={error}
                            modalClosed={errorConfirmedHandler}>
                                {error ? error.message : null}
                        </Modal>
                        <WrappedComponent {...props}/>
                    </Aux>
                );
            
       
    }
}
    


export default withErrorHandler;