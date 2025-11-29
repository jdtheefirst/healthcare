"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

export const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (path)
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
  }, [encryptedKey]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);

      localStorage.setItem("accessKey", encryptedKey);

      setOpen(false);
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog max-w-[90vw] w-full mx-auto sm:max-w-md">
        <AlertDialogHeader className="px-4 sm:px-6">
          <AlertDialogTitle className="flex items-start justify-between text-base sm:text-lg">
            <span className="flex-1 pr-3">Admin Access</span>
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={18}
              height={18}
              onClick={() => closeModal()}
              className="cursor-pointer flex-shrink-0 mt-0.5 sm:mt-1"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm px-0">
            Enter the passkey to access admin page
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="px-4 sm:px-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={passkey}
              onChange={(value) => {
                setPasskey(value);
                setError("");
              }}
            >
              {/* Mobile: 2 rows of 3, Desktop: 1 row of 6 */}
              <InputOTPGroup className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 justify-items-center">
                <InputOTPSlot
                  className="shad-otp-slot w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg"
                  index={0}
                />
                <InputOTPSlot
                  className="shad-otp-slot w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg"
                  index={1}
                />
                <InputOTPSlot
                  className="shad-otp-slot w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg"
                  index={2}
                />
                <InputOTPSlot
                  className="shad-otp-slot w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg"
                  index={3}
                />
                <InputOTPSlot
                  className="shad-otp-slot w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg"
                  index={4}
                />
                <InputOTPSlot
                  className="shad-otp-slot w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg"
                  index={5}
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <p className="shad-error text-xs sm:text-sm mt-3 text-center px-2">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter className="px-4 sm:px-6">
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full py-2.5 text-sm sm:text-base"
            disabled={passkey.length !== 6}
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
