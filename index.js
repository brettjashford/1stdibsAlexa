const Alexa = require("ask-sdk");
const get = require("lodash.get");
const getUnreadMessages = require("./lib/getUnreadMessages");
const getRequiredActions = require("./lib/getRequiredActions");

const LAUNCH_MESSAGE = "Welcome to the 1stdibs Sellers App";
const SKILL_NAME = "1stdibs Sellers";
const HELP_MESSAGE = "TODO: help message";
const HELP_REPROMPT = "What can I help you with?";
const STOP_MESSAGE = "Goodbye!";

const GetUnreadMessagesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetUnreadMessagesIntent"
    );
  },
  handle(handlerInput) {
    const numMessages = get(
      handlerInput,
      "requestEnvelope.request.intent.slots.numMessages.value"
    );
    return getUnreadMessages({ numMessages }).then(message =>
      handlerInput.responseBuilder
        .speak(message)
        .getResponse()
    );
  }
};

const GetRequiredActionsHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetRequiredActionsIntent"
    );
  },
  handle(handlerInput) {
    return getRequiredActions().then(message =>
      handlerInput.responseBuilder
        .speak(message)
        .getResponse()
    );
  }
}

// const LaunchHandler = {
//   canHandle(handlerInput) {
//     const request = handlerInput.requestEnvelope.request;
//     return request.type === "LaunchRequest";
//   },
//   handle(handlerInput) {
//     return handlerInput.responseBuilder
//       .speak(LAUNCH_MESSAGE)
//       .withSimpleCard(SKILL_NAME, LAUNCH_MESSAGE)
//       .getResponse();
//   }
// };

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(STOP_MESSAGE).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, an error occurred.")
      .reprompt("Sorry, an error occurred.")
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetUnreadMessagesHandler,
    GetRequiredActionsHandler
    // LaunchHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
