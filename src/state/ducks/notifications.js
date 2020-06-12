/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * This duck provides the Redux pieces to handle notifications.
 */
import { fromEvent as notificationFromEvent } from '../../utils/notifications';

const NOTIFICATION_SHOW = 'jangouts/notification/SHOW';
const NOTIFICATION_CLOSE = 'jangouts/notification/CLOSE';
const NOTIFICATION_BLOCK = 'jangouts/notification/BLOCK';
const DEFAULT_TIMEOUT = 5000;

/**
 * Notify that a given event has happened.
 *
 * @param [Object] event - Event to notify
 * @param [Number] timeout - Timeout (in miliseconds)
 * @see notifications
 */
const notifyEvent = (event, timeout) => (dispatch) => {
  const notification = notificationFromEvent(event);
  if (notification) {
    dispatch(notify(notification, timeout));
  }
};

/**
 * Action to display a notification (and hide it after the timeout)
 *
 * @param [UserNotification] notification - Notification
 * @param [Number] timeout - Timeout (in miliseconds)
 */
const notify = (notification, timeout = DEFAULT_TIMEOUT) => (dispatch) => {
  dispatch(show(notification));
  setTimeout(() => dispatch(close(notification.id)), timeout);
};

const show = (notification) => ({
  type: NOTIFICATION_SHOW,
  payload: { notification }
});

const close = (id) => ({
  type: NOTIFICATION_CLOSE,
  payload: { id }
});

const block = (type) => ({
  type: NOTIFICATION_BLOCK,
  payload: { type }
});

const dispatchAction = (id, action) => (dispatch) => {
  dispatch(action);
  dispatch(close(id))
}

const actionCreators = {
  notifyEvent,
  show,
  close,
  block,
  dispatchAction
};

const actionTypes = {
  NOTIFICATION_SHOW,
  NOTIFICATION_CLOSE,
  NOTIFICATION_BLOCK
};

const initialState = { notifications: [], blocklist: [] }

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_SHOW: {
      const { notification } = action.payload;
      if (state.blocklist.includes(notification.type)) {
        return state;
      }
      return {...state, notifications: [...state.notifications, notification] };
    }
    case NOTIFICATION_CLOSE: {
      const { id } = action.payload;
      const notifications = state.notifications.filter((n) => n.id !== id);
      return {...state, notifications };
    }
    case NOTIFICATION_BLOCK: {
      const { type } = action.payload;
      return {...state, blocklist: [...state.blocklist, type]}
    }

    default: {
      return state;
    }
  }
};

export { actionCreators, actionTypes, initialState };

export default reducer;
