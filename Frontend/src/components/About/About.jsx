import React from 'react'
import aboutImg from '../../assets/images/nation.png';
import aboutCardImg from '../../assets/images/about-card.png';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section>
        <div className='container'>
            <div className='flex justify-between gap-[50px]  lg:gap-[130px] xl:gap-0 flex-col lg:flex-row '>
                {/* about img */}
                <div className='relative w-3/4 lg:w-1/2 xl:w-[500px] z-10 order-2 lg:order-1 ml-3'>
                    <img src={aboutImg} alt="" />
                </div>

                {/* about content */}
                <div className='w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2 '>
                    <h2 className='heading'>Proud to be one of the nations best</h2>
                    <p className='text__para'>For 30 years in a row, U.S. News & World Report has recognised us as one of the best publics hospitals in the Nation and #1 in Texas.</p>
                    <p className="text__para mt-[30px]">Our best is something we strive for each day, caring for our patients-not looking back at what we accomplished but towards what we can do tomorrow. Providing the best.</p>
                    <Link to='/aboutUs'><button className='btn'>Learn More</button></Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default About;