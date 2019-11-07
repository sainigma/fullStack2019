const initialState = {
    content: '',
    sent: 1,
    time: 5,
    timeout: null
}

const notificationReducer = (state = initialState, action) => {
    if (action.type === 'NOTIFICATION') {
        const oldState = state
        return {
            content: action.data,
            sent: 0,
            timeout: oldState.timeout,
            time: action.time
        }
    }
    if (action.type === 'NOTIFICATIONSENT') {
        const oldState = state
        return {
            ...oldState,
            sent: 1,
            timeout: action.timeout
        }
    }
    return state
}
export const notify = (content,time) => {
    return {
        type: "NOTIFICATION",
        data: content,
        time: time ? time : initialState.time
    }
}

export const notificationSent = (timeout) => {
    return {
        type: "NOTIFICATIONSENT",
        timeout: timeout
    }
}
export default notificationReducer