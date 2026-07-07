package com.football.demo;

import com.football.demo.dto.MatchRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService service;

    public MatchController(MatchService service) {
        this.service = service;
    }

    @GetMapping
    public List<Match> getMatches(
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) String status) {
        return service.searchMatches(teamId, status);
    }

    @GetMapping("/{id}")
    public Match getMatch(@PathVariable Long id) {
        return service.getMatchById(id);
    }

    @PostMapping
    public ResponseEntity<Match> createMatch(@Valid @RequestBody MatchRequest request) {
        Match created = service.createMatch(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public Match updateMatch(@PathVariable Long id, @Valid @RequestBody MatchRequest request) {
        return service.updateMatch(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        service.deleteMatch(id);
        return ResponseEntity.noContent().build();
    }
}
