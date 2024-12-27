import React from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import ExploreTopBrands from '../components/ExploreTopBrands';
import LastCard from '../components/LastCard';

const UserPage = () => {


  return (
    <div>
      <div>
        <Navbar/>
      </div>
      <div>
        <Banner/>
      </div>

      {/* <div>
        <ExploreTopBrands/>
      </div> */}

      <div>
        <LastCard/>
      </div>
    




      <div>
        <Footer/>
      </div>
    </div>

    
  );
};

export default UserPage;
