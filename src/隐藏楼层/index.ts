import { reloadOnChatChange } from '@util/script';

const ATTR = 'data-th-only-latest-ai';
const CLS = 'th-only-latest-ai-hidden';

function getLatestAssistantMessageId(): number | null {
  const last = getLastMessageId();
  if (last < 0) return null;

  const assistants = getChatMessages(`0-${last}`, { role: 'assistant' });
  if (!assistants.length) return null;

  return assistants[assistants.length - 1].message_id;
}

function applyOnlyLatestAiVisible(): void {
  const latestAiId = getLatestAssistantMessageId();

  $('#chat > .mes').each((_i, node) => {
    const $mes = $(node);
    const mesId = Number($mes.attr('mesid'));
    const shouldShow = latestAiId !== null && !Number.isNaN(mesId) && mesId === latestAiId;

    if (shouldShow) {
      $mes.removeClass(CLS).removeAttr(ATTR).css('display', '');
      return;
    }
    $mes.addClass(CLS).attr(ATTR, '1').css('display', 'none');
  });
}

function restoreAllMessagesVisible(): void {
  $('#chat > .mes').removeClass(CLS).removeAttr(ATTR).css('display', '');
}

function init(): void {
  const apply = _.debounce(applyOnlyLatestAiVisible, 120);

  applyOnlyLatestAiVisible();

  const stops: EventOnReturn[] = [
    eventOn(tavern_events.MESSAGE_RECEIVED, apply),
    eventOn(tavern_events.MESSAGE_UPDATED, apply),
    eventOn(tavern_events.MESSAGE_DELETED, apply),
    eventOn(tavern_events.MESSAGE_SWIPED, apply),
    eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, apply),
    eventOn(tavern_events.USER_MESSAGE_RENDERED, apply),
    eventOn(tavern_events.MORE_MESSAGES_LOADED, apply),
  ];

  reloadOnChatChange();

  $(window).on('pagehide', () => {
    apply.cancel();
    stops.forEach(stop => stop.stop());
    restoreAllMessagesVisible();
  });
}

$(() => {
  errorCatched(init)();
});
