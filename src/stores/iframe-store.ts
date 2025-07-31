import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { debounce } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

export const useIframeStore = defineStore('iframe', () => {
  const { t } = useI18n();
  const $q = useQuasar();

  // State
  const iframeRefs = ref<HTMLIFrameElement[]>([]);
  const isLoading = ref(false);
  const hasError = ref(false);
  const errorMessage = ref('');
  const loadedFrames = ref(new Set<string>());
  const retryCount = ref(0);
  const maxRetries = 3;

  // Splitter models
  const splitterModel = ref(50);
  const horizontalSplitterModels = ref<Record<number, number>>({});
  const verticalSplitterModels = ref<Record<string, number>>({});
  const splitterLimits = ref([10, 90]);

  // Computed
  const allFramesLoaded = computed(() => {
    const expectedFrames = calculateExpectedFrames();
    return loadedFrames.value.size >= expectedFrames;
  });

  // Actions
  /**
   * Set iframe ref handler for template refs
   * @param el - HTMLIFrameElement or null
   */
  const setIframeRef = (el: HTMLIFrameElement | null) => {
    if (el && !iframeRefs.value.includes(el)) {
      iframeRefs.value.push(el);
    }
  };

  /**
   * Clear iframe refs when layout changes
   */
  const clearIframeRefs = () => {
    iframeRefs.value = [];
  };

  /**
   * Calculate expected number of frames based on layout structure
   * @param layout - Layout structure
   */
  const calculateExpectedFrames = (layout?: any[]): number => {
    if (!layout) return 0;

    let totalFrames = 0;
    layout.forEach((section) => {
      if (section.subFrames && section.subFrames > 1) {
        totalFrames += section.subFrames;
      } else {
        totalFrames += 1;
      }
    });
    return totalFrames;
  };

  /**
   * Handle iframe load event
   * @param frameId - Frame identifier
   * @param iframe - Iframe element
   */
  const onIframeLoad = (frameId: string, iframe: HTMLIFrameElement) => {
    loadedFrames.value.add(frameId);
    hasError.value = false;
    errorMessage.value = '';
    retryCount.value = 0;
    optimizeIframe(iframe);
  };

  /**
   * Handle iframe error event
   * @param frameId - Frame identifier
   */
  const onIframeError = (frameId: string) => {
    console.error(`Iframe load error for frame ${frameId}`);
    hasError.value = true;
    errorMessage.value = t('misc.connectionError');
    loadedFrames.value.delete(frameId);
  };

  /**
   * Optimize iframe performance
   * @param iframe - Iframe element to optimize
   */
  const optimizeIframe = (iframe: HTMLIFrameElement) => {
    try {
      iframe.style.willChange = 'auto';
      iframe.style.transform = 'translateZ(0)';
      iframe.addEventListener('contextmenu', (e) => e.preventDefault());
    } catch (error) {
      console.warn('Could not optimize iframe:', error);
    }
  };

  /**
   * Handle retry connection logic
   */
  const handleRetry = () => {
    if (retryCount.value < maxRetries) {
      retryCount.value++;
      isLoading.value = true;
      hasError.value = false;
      loadedFrames.value.clear();
      clearIframeRefs();

      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    } else {
      $q.notify({
        type: 'negative',
        message: t('misc.maxRetriesReached'),
        position: 'top',
      });
    }
  };

  /**
   * Retry connection with debounce
   */
  const retryConnection = debounce(handleRetry, 1000);

  /**
   * Reset state
   */
  const resetState = () => {
    loadedFrames.value.clear();
    clearIframeRefs();
    hasError.value = false;
    retryCount.value = 0;
  };

  /**
   * Initialize splitter positions from localStorage
   * @param layout - Layout structure
   */
  const initializeSplitterPositions = (layout: any[]) => {
    const savedPosition = localStorage.getItem('iframe-splitter-position');
    if (savedPosition) {
      splitterModel.value = parseInt(savedPosition, 10);
    }

    layout.forEach((section, index) => {
      if (section.subFrames && section.subFrames > 1) {
        const savedHorizontalPosition = localStorage.getItem(`iframe-horizontal-splitter-${index}`);
        if (savedHorizontalPosition) {
          horizontalSplitterModels.value[index] = parseInt(savedHorizontalPosition, 10);
        } else {
          horizontalSplitterModels.value[index] = 50;
        }
      }
    });
  };

  /**
   * Handle splitter position changes
   * @param newValue - New splitter position
   */
  const onSplitterChange = (newValue: number) => {
    localStorage.setItem('iframe-splitter-position', newValue.toString());
  };

  /**
   * Handle vertical splitter position changes
   * @param splitterId - Unique splitter identifier
   * @param newValue - New splitter position
   */
  const onVerticalSplitterChange = (splitterId: string, newValue: number) => {
    verticalSplitterModels.value[splitterId] = newValue;
    localStorage.setItem(`iframe-vertical-splitter-${splitterId}`, newValue.toString());
  };

  /**
   * Handle horizontal splitter position changes
   * @param sectionIndex - Section index
   * @param newValue - New splitter position
   */
  const onHorizontalSplitterChange = (sectionIndex: number, newValue: number) => {
    horizontalSplitterModels.value[sectionIndex] = newValue;
    localStorage.setItem(`iframe-horizontal-splitter-${sectionIndex}`, newValue.toString());
  };

  return {
    // State
    iframeRefs,
    isLoading,
    hasError,
    errorMessage,
    loadedFrames,
    retryCount,
    maxRetries,
    splitterModel,
    horizontalSplitterModels,
    verticalSplitterModels,
    splitterLimits,

    // Computed
    allFramesLoaded,

    // Actions
    setIframeRef,
    clearIframeRefs,
    calculateExpectedFrames,
    onIframeLoad,
    onIframeError,
    optimizeIframe,
    handleRetry,
    retryConnection,
    resetState,
    initializeSplitterPositions,
    onSplitterChange,
    onVerticalSplitterChange,
    onHorizontalSplitterChange,
  };
});
