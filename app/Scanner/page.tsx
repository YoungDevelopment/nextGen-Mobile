import QRScanner from "@/components/QRScanner";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      } else {
        setUser(session.user);
      }
    };

    getUser();
  }, []);
  const UID = user?.id;
  console.log("User:", UID);
  return <QRScanner uid={UID} />;
};

export default Page;
