
// import React from "react";
// import Header from "../components/Header/Header";
// import Footer from "../components/Footer/Footer";
// import Routers from "../routes/Routers";
// import { ProfilePhotoProvider } from "../context/ProfilePhotoProvider";

// const Layout = () => {
//   return (
//     <ProfilePhotoProvider>
//       <div className="layout-container">
//         <Header />
//         <main>
//           <Routers />
//         </main>
//         <Footer />
//       </div>
//     </ProfilePhotoProvider>
//   );
// };

// export default Layout;

import React from "react"; 
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Routers from "../routes/Routers";

const Layout = () => {
    return (
        <>
          <Header />
          <main>
            <Routers />
          </main>
          <Footer />
        </>
    )
};

export default Layout;