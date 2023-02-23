import React from "react";
import "../../style/navigation.css";

const BottomNavigationBar = () => {
  return (
    <footer className="footer">
      <div className="container content">
        <div className="columns">
          <div className="column column-logo">
            <p>
              <a href="/">
                <img
                  className="image-logo"
                  src="https://static.invitemember.com/img/logo-225.png"
                  alt="Onemembership logo"
                />
              </a>
            </p>
            <p>
              <a href="https://stripe.com/about" target="_blank">
                <img
                  className="lozad"
                  alt="Stripe Verified Partner logo"
                  style={{ marginTop: "0px", maxWidth: "80%" }}
                  src="https://static.invitemember.com/img/payments/Stripe/verified-partner-svg/L_White_Outline.svg"
                />
              </a>
            </p>
          </div>
          <div className="column">
            <h3 className="title is-6">Resources</h3>
            <a
              href="https://help.invitemember.com"
              className="link"
              target="_blank"
              rel="noopener"
            >
              <svg
                className="svg-inline--fa fa-question-circle fa-w-16 fa-fw"
                ariaHidden="true"
                dataPrefix="far"
                dataIcon="question-circle"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
                ></path>
              </svg>
              &nbsp;&nbsp;Help Center
            </a>
            <br />

            <a
              href="https://t.me/joinchat/AAAAAE59ckPCJh9InRSlgA"
              className="link"
              target="_blank"
              rel="noopener"
            >
              <svg
                className="svg-inline--fa fa-telegram-plane fa-w-14 fa-fw"
                ariaHidden="true"
                dataPrefix="fab"
                dataIcon="telegram-plane"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                // data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"
                ></path>
              </svg>
              &nbsp;&nbsp;Telegram Channel
            </a>
            <br />

            <a
              href="https://twitter.com/intent/follow?screen_name=Onemembership"
              className="link"
              target="_blank"
              rel="noopener"
            >
              <svg
                className="svg-inline--fa fa-twitter fa-w-16 fa-fw"
                ariaHidden="true"
                dataPrefix="fab"
                dataIcon="twitter"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                ></path>
              </svg>
              &nbsp;&nbsp;Twitter
            </a>

            <br />

            <a
              href="https://medium.com/invitemember"
              className="link"
              target="_blank"
              rel="noopener"
            >
              <svg
                className="svg-inline--fa fa-medium-m fa-w-16 fa-fw"
                ariaHidden="true"
                dataPrefix="fab"
                dataIcon="medium-m"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                // data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M71.5 142.3c.6-5.9-1.7-11.8-6.1-15.8L20.3 72.1V64h140.2l108.4 237.7L364.2 64h133.7v8.1l-38.6 37c-3.3 2.5-5 6.7-4.3 10.8v272c-.7 4.1 1 8.3 4.3 10.8l37.7 37v8.1H307.3v-8.1l39.1-37.9c3.8-3.8 3.8-5 3.8-10.8V171.2L241.5 447.1h-14.7L100.4 171.2v184.9c-1.1 7.8 1.5 15.6 7 21.2l50.8 61.6v8.1h-144v-8L65 377.3c5.4-5.6 7.9-13.5 6.5-21.2V142.3z"
                ></path>
              </svg>
              &nbsp;&nbsp;Medium Blog
            </a>
          </div>

          <div className="column">
            <h3 className="title is-6">Contact us</h3>
            <a
              href="https://t.me/OnemembershipSupportBot"
              className="link"
              target="_blank"
              rel="noopener"
            >
              <svg
                className="svg-inline--fa fa-telegram-plane fa-w-14 fa-fw"
                ariaHidden="true"
                dataPrefix="fab"
                dataIcon="telegram-plane"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                // data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"
                ></path>
              </svg>
              &nbsp;&nbsp;Chat with support
            </a>
            <br />

            <a
              href="mailto:support@invitemember.com"
              className="link"
              target="_blank"
              rel="noopener"
            >
              <svg
                className="svg-inline--fa fa-at fa-w-16 fa-fw"
                ariaHidden="true"
                dataPrefix="fas"
                dataIcon="at"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                // data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M256 8C118.941 8 8 118.919 8 256c0 137.059 110.919 248 248 248 48.154 0 95.342-14.14 135.408-40.223 12.005-7.815 14.625-24.288 5.552-35.372l-10.177-12.433c-7.671-9.371-21.179-11.667-31.373-5.129C325.92 429.757 291.314 440 256 440c-101.458 0-184-82.542-184-184S154.542 72 256 72c100.139 0 184 57.619 184 160 0 38.786-21.093 79.742-58.17 83.693-17.349-.454-16.91-12.857-13.476-30.024l23.433-121.11C394.653 149.75 383.308 136 368.225 136h-44.981a13.518 13.518 0 0 0-13.432 11.993l-.01.092c-14.697-17.901-40.448-21.775-59.971-21.775-74.58 0-137.831 62.234-137.831 151.46 0 65.303 36.785 105.87 96 105.87 26.984 0 57.369-15.637 74.991-38.333 9.522 34.104 40.613 34.103 70.71 34.103C462.609 379.41 504 307.798 504 232 504 95.653 394.023 8 256 8zm-21.68 304.43c-22.249 0-36.07-15.623-36.07-40.771 0-44.993 30.779-72.729 58.63-72.729 22.292 0 35.601 15.241 35.601 40.77 0 45.061-33.875 72.73-58.161 72.73z"
                ></path>
              </svg>
              &nbsp;&nbsp;Write us a letter
            </a>
          </div>

          <div className="column">
            <h3 className="title is-6">Onemembership LLC</h3>
            <strong>Mailing Address</strong>
            <br />
            16192 Coastal Highway <br />
            Lewes, Delaware 19958 USA
            <br />
            &nbsp;
            <br />
            <a href="/terms" className="link ">
              Terms
            </a>
            ·
            <a href="/privacy" className="link ">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BottomNavigationBar;
