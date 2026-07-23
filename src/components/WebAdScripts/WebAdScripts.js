import { useEffect } from "react";
import { Platform } from "react-native";

// Adsterra Social Bar only. Popunder was REMOVED after it started firing
// repeatedly (5-6+ times in a row) and freezing the app's own buttons.
//
// Root cause: our click-gatekeeper technique (capture-phase listener +
// localStorage cooldown) only controls the standard `click` event. Many
// popunder scripts - especially lower-tier/aggressive networks - also
// trigger off `mousedown`, `touchstart`, or their own internal retry/timer
// logic that has nothing to do with a click event at all, specifically to
// get around exactly this kind of publisher-side blocking. Once the
// script's own asset requests started failing (see the
// ERR_CONNECTION_CLOSED / ERR_SSL_VERSION_OR_CIPHER_MISMATCH errors, likely
// from regional network filtering), it appears to have gone into some kind
// of retry loop that kept attempting to pop regardless of our gate.
//
// A popunder is a live, complex third-party program we don't control and
// can't fully sandbox from a simple <script> include - it isn't worth the
// risk of it breaking core gameplay again. Social Bar is a much lower-risk,
// passive banner widget with no popup/window-hijacking behavior, so it's
// kept as-is.
const SOCIAL_BAR_SRC =
  "https://pl30447991.effectivecpmnetwork.com/92/97/91/929791823e5487b2dbf9ebb99641e5b9.js";

const WebAdScripts = () => {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return undefined;

    const socialBarEl = document.createElement("script");
    socialBarEl.src = SOCIAL_BAR_SRC;
    socialBarEl.async = true;
    document.body.appendChild(socialBarEl);

    return () => {
      if (socialBarEl.parentNode) socialBarEl.parentNode.removeChild(socialBarEl);
    };
  }, []);

  return null;
};

export default WebAdScripts;

// FILE LOCATION: src/components/WebAdScripts/WebAdScripts.js (REPLACE existing file)
