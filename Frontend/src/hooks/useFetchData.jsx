import { useEffect, useState } from "react";
import { token } from "../config";

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   setLoading(true);
    //   try {
    //     const res = await fetch(url, {
    //       headers: { Authorization: `Bearer ${token}` },
    //     });

    //     const result = await res.json();

    //     if (!res.ok) {
    //       console.log(result.message);
    //       throw new Error(result.message + '😞');
    //     }

    //     setData(result.data);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // if (url) {
    //   fetchData();
    // }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        console.log('Fetch result:', result);
        if (!res.ok) {
          console.log(result.message);
          throw new Error(result.message);
        }
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;


// import { useEffect, useState } from "react";
// import { token } from "../config";

// const useFetchData = (url) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const result = await res.json();

//         if (!res.ok) {
//           console.log(result.message);
//           throw new Error(result.message + '😞');
//         }

//         setData(result.data);
//         setLoading(false);
//       } catch (err) {
//         setLoading(false);
//         setError(err.message);
//       }
//     };

//     fetchData();
//   }, [url]);

//   return { data, loading, error };
// };

// export default useFetchData;