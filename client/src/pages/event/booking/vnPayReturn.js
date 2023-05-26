import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { vnPayReturn } from '../../../actions/booking';
import Loading from '../../../components/loading';
import { useRouter } from 'next/router';
const VnPayReturn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkSum = async () => {
      try {
        const res = await vnPayReturn();
        if (res.code === '00') {
          Swal.fire('Congratulation!', 'Payment successfully!', 'success').then(
            () => router.push('/')
          );
        } else {
          Swal.fire('Oops!', 'Payment failed!', 'error').then(() =>
            router.push('/')
          );
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    checkSum();
  }, []);
  return <>{loading && <Loading />}</>;
};

export default VnPayReturn;
