export function getOtherUser(conv, userId) {
      return conv.participants.find((p: any) => p._id !== userId);
    }