import useAuthUser from "../hooks/useAuthUser";
import { useLocation, Link } from "react-router";
import { BellIcon, LogOutIcon, ShipWheelIcon, XIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

const Navbar = () => {
    const {authUser} = useAuthUser();   
    const location = useLocation();
    const currentPath = location.pathname;
    const isChatPage = currentPath?.startsWith("/chat");

    const {logoutMutation} = useLogout();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end w-full">
              {/* LOGO - ONLY IN THE CHAT PAGE */}
              {isChatPage && (
                <div className="pl-5">
                  <Link to="/" className="flex items-center gap-2.5">
                    <ShipWheelIcon className="size-9 text-primary" />
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                      SpeakWise
                    </span>
                  </Link>
                </div>
              )}
    
              <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                <Link to={"/notifications"}>
                  <button className="btn btn-ghost btn-circle">
                    <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                  </button>
                </Link>
              </div>
    
              {/* TODO */}
              <ThemeSelector />
    
              <div className="avatar">
                <div className="w-9 rounded-full">
                  <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
                </div>
              </div>
    
              {/* Logout button */}
              <button className="btn btn-ghost btn-circle" onClick={() => setShowLogoutConfirm(true)}>
                <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>

              {/* Logout Confirmation Dialog */}
              {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-base-100 rounded-lg">
                    <div className="p-5">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2">Confirm Logout</h3>
                      </div>
                      <div className="flex justify-center gap-3">
                        <button 
                          className="btn btn-ghost"
                          onClick={() => setShowLogoutConfirm(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn btn-error"
                          onClick={() => {
                            logoutMutation();
                            setShowLogoutConfirm(false);
                          }}
                        >   
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      );
}

export default Navbar;