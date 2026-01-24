import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StudentProfile } from "@/data/curriculum";

interface ProfileContextType {
  profile: StudentProfile | null;
  setProfile: (profile: StudentProfile | null) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = "moyennecalc_profile";

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      try {
        setProfileState(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored profile:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const setProfile = (newProfile: StudentProfile | null) => {
    setProfileState(newProfile);
    if (newProfile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } else {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
