import { useMemo, useState } from "react";
import {
  AuthContext,
  ErrorContext,
  EventContext,
  LoadingContext,
  LogContext,
  UserContext,
  EventDataContext,
} from "../context/Context";
function Shared({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);
  const [error, setError] = useState(false);
  const [event, setEvent] = useState(null);
  const [eventData, setEventData] = useState(null);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const eventState = useMemo(() => ({ event, setEvent }), [event, setEvent]);
  const eventDataState = useMemo(
    () => ({ eventData, setEventData }),
    [eventData, setEventData]
  );
  const errors = useMemo(() => ({ error, setError }), [error, setError]);
  const loader = useMemo(
    () => ({ loading, setLoading }),
    [loading, setLoading]
  );
  const auth = useMemo(
    () => ({ authenticated, setAuthenticated }),
    [authenticated, setAuthenticated]
  );

  const log = useMemo(() => ({ login, setLogin }), [login, setLogin]);
  return (
    <UserContext.Provider value={value}>
      <EventContext.Provider value={eventState}>
        <ErrorContext.Provider value={errors}>
          <EventDataContext.Provider value={eventDataState}>
            <LoadingContext.Provider value={loader}>
              <LogContext.Provider value={log}>
                <AuthContext.Provider value={auth}>
                  {children}
                </AuthContext.Provider>
              </LogContext.Provider>
            </LoadingContext.Provider>
          </EventDataContext.Provider>
        </ErrorContext.Provider>
      </EventContext.Provider>
    </UserContext.Provider>
  );
}

export default Shared;
