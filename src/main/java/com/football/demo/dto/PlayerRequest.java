package com.football.demo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PlayerRequest {

    @NotBlank(message = "Player name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @Min(value = 16, message = "Age must be at least 16")
    @Max(value = 45, message = "Age must be at most 45")
    private int age;

    @NotBlank(message = "Position is required")
    private String position;

    @NotNull(message = "Team id is required")
    private Long teamId;

    @Min(value = 1, message = "Jersey number must be at least 1")
    @Max(value = 99, message = "Jersey number must be at most 99")
    private int jerseyNumber;

    public PlayerRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public int getJerseyNumber() {
        return jerseyNumber;
    }

    public void setJerseyNumber(int jerseyNumber) {
        this.jerseyNumber = jerseyNumber;
    }
}
