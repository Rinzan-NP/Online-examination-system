package com.exam.model.question;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Encapsulated Option for Multiple Choice Questions.
 */
public class QuestionOption {

    private String id;
    private String text;

    @JsonProperty("isCorrect")
    @JsonAlias({"correct", "isCorrect"})
    private boolean isCorrect;

    public QuestionOption() {}

    public QuestionOption(String id, String text, boolean isCorrect) {
        this.id = id;
        this.text = text;
        this.isCorrect = isCorrect;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @JsonProperty("isCorrect")
    public boolean isCorrect() {
        return isCorrect;
    }

    @JsonProperty("isCorrect")
    @JsonAlias({"correct", "isCorrect"})
    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}

