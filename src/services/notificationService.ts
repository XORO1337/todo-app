import { Howl } from 'howler';
import { toast } from 'react-toastify';
import notificationSound from '../../public/notification.mp3';

const notification = new Howl({
  src: [notificationSound],
  volume: 0.5,
});

export const showNotification = (taskText: string) => {
  notification.play();
  toast.info(`Task Reminder: ${taskText}`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};