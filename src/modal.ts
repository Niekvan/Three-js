class Modal {
  private modal: HTMLElement;
  private videoEl!: HTMLVideoElement;
  private audioEl!: HTMLAudioElement;

  private items: string[] = [
    '01_01_LAND',
    'VILLAGES_04_STREETSCAPE',
    'VILLAGES 03_FACTORY MASSING_0',
    'VILLAGES_01_WAREHOUSE_MASSING',
  ];

  constructor() {
    this.modal = document.querySelector('.modal');
    this.videoEl = this.modal.querySelector('.modal__video');
    this.audioEl = this.modal.querySelector('.modal__audio');

    const close: HTMLElement = this.modal.querySelector('.modal__close');
    close.addEventListener('click', () => this.hideModal());
  }

  private mapElementToContent(element: string) {
    return {
      video: '/public/videos/Time Lapse Video Of Aurora Borealis.mp4',
      audio: '/public/audio/mixkit-hip-hop-02-738.mp3',
    };
  }

  public showModal(element: string) {
    if (!this.items.includes(element)) return;

    const { video, audio } = this.mapElementToContent(element);
    this.videoEl.src = video;
    this.audioEl.src = audio;
    this.modal.classList.remove('hidden');
  }

  public hideModal() {
    this.modal.classList.add('hidden');
    this.audioEl.pause();
  }
}
export default new Modal();
