package com.mes_career_link.mes_career_link.controller;

import com.mes_career_link.mes_career_link.dto.MessageDTO;
import com.mes_career_link.mes_career_link.entity.Message;
import com.mes_career_link.mes_career_link.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private MessageService messageService;

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message sendMessage(MessageDTO messageDTO) {
        return messageService.sendMessage(messageDTO.getSenderUsername(), messageDTO.getReceiverUsername(), messageDTO.getContent());
    }
}