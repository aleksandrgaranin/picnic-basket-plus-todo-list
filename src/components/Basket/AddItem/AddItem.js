import React, {useState} from 'react';
import Aux from '../../../hoc/Auxx/Auxx';
import AddItemModal from './AddItemModal/AddItemModal';

import Modal from '../../UI/Modal/Modal'

import classes from './AddItem.module.css';


const AddItem = props => {
    const [showModal, setShowModal] = useState(false);

    const showModalHandler = () => {
        setShowModal(true);
    }

    const closeShowModalHandler = () => {
        setShowModal(false);
    }
    
    let modal = null;

    if(showModal){
        modal = <Modal show={showModal} closed={closeShowModalHandler} >
            <AddItemModal  closed={closeShowModalHandler}/>
        </Modal>
    }

    return (
        <Aux >
            <div className={classes.BuildControls}>
                <button link="/add"
                    onClick = {showModalHandler}                
                    className = {classes.AddButton}>
                        Add Item
                </button>
                {modal}
            </div>
        </Aux>
    );
};

export default AddItem;

