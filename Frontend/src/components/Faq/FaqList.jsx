/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { faqs } from './../../assets/data/faqs';
import FaqItem from "./FaqItem";

const FaqList = () => {

    return(
        <ul className='mt-[35px] '>
            {faqs.map((item,index)=> <FaqItem item={item} key={index}/>)}
        </ul>
    )
}
  

export default FaqList;
